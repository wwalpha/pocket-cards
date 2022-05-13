//
//  DailyStudyView.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//
import SwiftUI

struct DailyStudyView: View {
    var interactor: DailyStudyBusinessLogic?
    @ObservedObject var viewModel = DailyStudyViewModel()

    var body: some View {
        if viewModel.isLoading {
            Text("Loading....")
                .onAppear {
                    Task {
                        await interactor?.loadQuestions()
                    }
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
    func showError(model: DailyStudyViewModel) {
        DispatchQueue.main.async {
            viewModel.isLoading = model.isLoading
            viewModel.isFinish = model.isFinish
            viewModel.isShowError = model.isShowError
        }
    }

    func showNext(model: DailyStudyViewModel) {
        DispatchQueue.main.async {
            viewModel.isLoading = model.isLoading
            viewModel.isFinish = model.isFinish
            viewModel.isShowError = model.isShowError
        }

        viewModel.question = model.question
    }
}

extension DailyStudyView {
    func configureView(subject: String) -> some View {
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
        DailyStudyView().configureView(subject: SUBJECT.LANGUAGE)
    }
}
