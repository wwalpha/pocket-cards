//
//  DailyTestView.swift
//  PocketCards
//
//  Created by macmini on 2022/03/09.
//
import SwiftUI

struct DailyTestView: View {
    var interactor: DailyTestBusinessLogic?
    @ObservedObject var viewModel = DailyTestViewModel()

    var body: some View {
        if viewModel.isLoading {
            Text("Loading....")
                .onAppear {
                    Task {
                        await interactor?.initialize()
                    }
                }
        } else if viewModel.isFinish {
            Text("今日のテストは終わりました")
                .font(.system(size: 64, design: .default))
        } else {
            if viewModel.question?.choices != nil {
                ChoiceQuestion(
                    question: viewModel.question!,
                    isShowError: "",
                    onChoice: interactor!.onChoice
                )
            } else {
                // Society or Science
                FlashCard(question: viewModel.question!, action: interactor!.onAction)
            }
        }
    }
}

extension DailyTestView: DailyTestDisplayLogic {
    func onUpdate(model: DailyTestViewModel) {
        DispatchQueue.main.async {
            viewModel.isLoading = model.isLoading
            viewModel.isFinish = model.isFinish
            viewModel.question = model.question
        }
    }

    func showNext(model: DailyTestViewModel) {
        DispatchQueue.main.async {
            viewModel.question = model.question
        }
    }
}

extension DailyTestView {
    func configureView(subject: String, loadUrl: String) -> some View {
        var view = self
        let interactor = DailyTestInteractor(loadUrl: loadUrl, subject: subject)
        let presenter = DailyTestPresenter()

        view.interactor = interactor
        interactor.presenter = presenter
        presenter.view = view

        // initialize
        view.viewModel.isLoading = true

        return view
    }
}

struct DailyTestView_Previews: PreviewProvider {
    static var previews: some View {
        DailyTestView().configureView(subject: SUBJECT.LANGUAGE, loadUrl: URLs.STUDY_DAILY_EXAM)
    }
}
