//
//  DailyStudyView.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//
import SwiftUI

struct DailyStudyView: View {
    var interactor: DailyStudyBusinessLogic?
    private var subject: String

    @ObservedObject var viewModel = DailyStudyViewModel()

    init(subject: String) {
        self.subject = subject
    }

    var body: some View {
        if viewModel.isLoading {
            Text("Loading....")
                .onAppear {
                    interactor?.loadQuestion()
                }
        } else if viewModel.isFinish {
            Text("今日の学習は終わりました")
                .font(.system(size: 64, design: .default))
        } else {
            if viewModel.question?.choices != nil {
                ChoiceQuestion(
                    question: viewModel.question!,
                    isShowError: viewModel.isShowError,
                    onChoice: interactor!.onChoice
                )
            } else {
                // Society or Science
                FlashCard(question: viewModel.question!, action: interactor!.onAction)
            }
        }
    }
}

extension DailyStudyView: DailyStudyDisplayLogic {
    func showError(index: String) {
        viewModel.isShowError = index
    }

    func showNext(model: DailyStudyViewModel) {
        viewModel.isLoading = model.isLoading
        viewModel.isFinish = model.isFinish
        viewModel.question = model.question
        viewModel.isShowError = model.isShowError
    }
}

extension DailyStudyView {
    func configureView() -> some View {
        var view = self
        let interactor = DailyStudyInteractor(subject: subject)
        let presenter = DailyStudyPresenter()

        view.interactor = interactor
        interactor.presenter = presenter
        presenter.view = view

        view.viewModel.isLoading = true

        return view
    }
}

struct DailyStudyView_Previews: PreviewProvider {
    static var previews: some View {
        DailyStudyView(subject: SUBJECT.LANGUAGE)
    }
}
